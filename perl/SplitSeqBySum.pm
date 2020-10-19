package SplitSeqBySum;
use Data::Dumper ;

sub GetEqualDistanceFor($$);
sub GetSumTill($\%) ;

our $SumOfNos100Thousand = 5;
our $IncForEvery100Thousand = 10; ### 10+Prev100ThousandSum
our $StepFor = 100000;

sub GetEqualDistanceFor($$) {
  my ($Till,$SplitTo) = @_ ;
  my (@EqualDistance,$EqualDistance,$NextEqualDistance);
  my ($SumTillAmicable,%BlocksSum);
  my ($StartNo) ;

  $SumTillAmicable = GetSumTill $Till,%BlocksSum;
  $EqualDistance  = int($SumTillAmicable/$SplitTo);

  $NextEqualDistance = $EqualDistance;
  $StartNo = 1;
  
  for my $Block (sort {$a <=> $b} keys %BlocksSum) {
    if( $BlocksSum{$Block} > $NextEqualDistance) {
      push @EqualDistance, [ $StartNo, $Block ] ;
      $NextEqualDistance += $EqualDistance;
      $StartNo = $Block+1;
    }
  } 

  push @EqualDistance, [$StartNo,$Till];

  return [@EqualDistance];
}

sub GetSumTill($\%) {
  my ($Till,$BlocksSum) = @_ ;
  my ($Sum,$CurStep,$PrevBlocksSum) ;
  my (%BlocksSum);

  $CurStep = $StepFor;
  $Sum = $PrevBlocksSum = $SumOfNos100Thousand;
  
  while($CurStep < $Till) {
    $BlocksSum->{$CurStep} = $Sum;
    $Sum += $PrevBlocksSum + $IncForEvery100Thousand;
    $CurStep += $StepFor;
    $PrevBlocksSum += $IncForEvery100Thousand;
  }
  $BlocksSum->{$CurStep} = $Sum;

  return $Sum;
}
